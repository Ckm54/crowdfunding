import React, { useState, useEffect } from 'react'

import { DisplayCampaigns } from '../components';
import { StateContext, ContractContextType } from '../context'

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  const { address, contract, getCampaigns } = React.useContext(StateContext) as ContractContextType;

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data: any = await getCampaigns();
    setCampaigns(data);
    setIsLoading(false);
  }

  useEffect(() => {
    if(contract) fetchCampaigns();
  }, [address, contract]);

  return (
    <DisplayCampaigns
      title="All Campaigns"
      isLoading={isLoading}
      campaigns={campaigns}
    />
  )
}

export default Home