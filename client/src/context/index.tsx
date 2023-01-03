import React, { useContext, createContext } from 'react';

import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { BigNumber, ethers } from 'ethers';
import { SmartContract } from '@thirdweb-dev/sdk';

interface StateContextProviderProps {
  children: React.ReactNode;
}

export type ContractContextType = {
  address: string | undefined;
  contract: SmartContract<ethers.BaseContract> | undefined
  //! to update type with appropriate one 
  connect: any;
  createCampaign: (form: FormInputData) => Promise<void>;
  getCampaigns: () => Promise<void>;
  getUserCampaigns: () => Promise<void>;
  fundCampaign: (pId: number, amount: string) => Promise<any>;
  getDonations: (pId: number) => Promise<{ donator: any; donation: string; }[]>;
}

type FormInputData = {
  name: string,
  title: string,
  description: string,
  target: BigNumber,
  deadline: string,
  image: string,
}

export const StateContext = createContext<ContractContextType | null>(null);

export const StateContextProvider = ({ children }: StateContextProviderProps) => {
  const { contract } = useContract('0x1DBA8F0f077A5B0bb47E81083a711eF268Dfa980');

  const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');

  const address = useAddress();
  const connect = useMetamask();

  const publishCampaign = async (form: FormInputData) => {
    try {
      const data = await createCampaign([
        address, // owner
        form.title, // title
        form.description, // description
        form.target, // target
        new Date(form.deadline).getTime(), //deadline
        form.image, // image
      ]);

      console.log("contract call success", data);
    } catch (error) {
      console.log("contract call failure", error);
    }
  }

  const getCampaigns = async () => {
    const campaigns = await contract?.call('getCampaigns');

    const parsedCampaigns = campaigns.map((campaign: any, i: number) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
      image: campaign.image,
      pId: i,
    }));

    return parsedCampaigns;
  }

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.filter((campaign: any) => 
    campaign.owner === address);

    return filteredCampaigns;
  }

  const fundCampaign = async (pId: number, amount: string) => {
    const data = await contract?.call('donateToCampaign', pId, {value: ethers.utils.parseEther(amount)});

    return data;
  }

  const getDonations = async (pId: number) => {
    const donations = await contract?.call('getDonators', pId);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for(let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i]).toString(),
      })
    }

    return parsedDonations;
  }

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        getCampaigns,
        getUserCampaigns,
        fundCampaign,
        getDonations,
        createCampaign: publishCampaign,
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

// custom hook to utilize context
// export const useStateContext = () => useContext(StateContext) as ContractContextType;
export default StateContextProvider;