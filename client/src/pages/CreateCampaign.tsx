import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

import { ContractContextType, StateContext } from '../context';

import { money } from '../assets';
import { CustomButton, FormField, Loader } from '../components';
import { checkIfImage } from '../utils';

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { createCampaign } = React.useContext(StateContext) as ContractContextType;

  const [form, setForm] = useState({
    name: '',
    title: '',
    description: '',
    target: '',
    deadline: '',
    image: '',  
  });

  const handleFormFieldChange = (fieldName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [fieldName]: e.target.value
    });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    checkIfImage(form.image,async (exists:boolean) => {
      if(exists) {
        setIsLoading(true);
        await createCampaign({...form, target: ethers.utils.parseUnits(form.target, 18)});
        setForm({
          name: '',
          title: '',
          description: '',
          target: '',
          deadline: '',
          image: '',  
        });
        setIsLoading(false);
        navigate('/');
      } else {
        alert('Provide a valid image url');
        setForm({...form, image: ''});
      }    
    });
  }

  return (
    <div className='bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4'>
      {isLoading && <Loader />}

      <div className='flex justify-center items-center p-[16px] sm:min-w-[300px] bg-[#3a3a43] rounded-[10px]'>
        <h1 className='font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white'>Start a campaign</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className='w-full mt-[65px] flex flex-col gap-[30px]'
      >
        <div className='flex flex-wrap gap-[40px]'>
          <FormField
            labelName="Your Name *"
            placeholder="John Doe"
            inputType="text"
            value={form.name}
            handleChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFormFieldChange('name', e)}
          />
          
          <FormField
            labelName="Campaign Title *"
            placeholder="write a title"
            inputType="text"
            value={form.title}
            handleChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFormFieldChange('title', e)}
          />
        </div>

        <FormField
            labelName="Story *"
            placeholder="write your story"
            isTextArea
            value={form.description}
            handleChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFormFieldChange('description', e)}
          /> 

        <div className='flex w-full justify-start items-center p-4 bg-[#8c6dfd] h-[120px] rounded-[10px]'>
          <img src={money} alt="money" className='w-[40px] h-[40px] object-contain' />
          <h4 className='font-epilogue font-bold text-[25px] text-white ml-[20px]'>
            You will receive 100% of the raised amount
          </h4>
        </div>

        <div className='flex flex-wrap gap-[40px] items-center'>
          <FormField
            labelName="Goal *"
            placeholder="ETH 0.50"
            inputType="number"
            value={form.target}
            handleChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFormFieldChange('target', e)}
          />
          
          <FormField
            labelName="End Date *"
            placeholder="End Date"
            inputType="date"
            value={form.deadline}
            handleChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFormFieldChange('deadline', e)}
          />
        </div>

        <FormField
          labelName="Campaign image *"
          placeholder="Place image url of your campaign"
          inputType="url"
          value={form.image}
          handleChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFormFieldChange('image', e)}
        />

        <div className='flex justify-center items-center mt-[40px]'>
          <CustomButton
            btnType='submit'
            title='Submit new campaign'
            styles='bg-[#1dc071] mb-[10px]'
          />
        </div>

      </form>
    </div>
  )
}

export default CreateCampaign