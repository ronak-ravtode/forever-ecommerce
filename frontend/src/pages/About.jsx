import React from 'react'
import Title from '../components/Title'
import {assets} from '../assets/frontend_assets/assets'
import NewsLetterBox from '../components/NewsLetterBox'

const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1="ABOUT" text2="US" />
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img src={assets.about_img} className='w-full md:max-w-[450px]' alt="" />
        <div className='flex flex-col gap-6 justify-center md:w-2/4 text-gray-600'>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero dolores, facere doloribus sint harum, minima non nesciunt, quibusdam atque corrupti doloremque omnis maiores tempora asperiores nisi natus eos. Non pariatur optio asperiores totam dolores vel?</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi nulla veniam unde voluptatum eos doloremque ducimus veritatis reprehenderit distinctio autem. Ad, aliquam iure ut omnis tempora mollitia assumenda officia voluptates doloribus quis enim autem tenetur?</p>
          <b className='text-gray-800'>Our Mission</b>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero dolores, facere doloribus sint harum, minima non nesciunt, quibusdam atque corrupti doloremque omnis maiores tempora asperiores nisi natus eos. Non pariatur optio asperiores totam dolores vel?</p>
        </div>
      </div>
      <div className='text-xl py-4'>
        <Title text1="WHY" text2="CHOOSE US" />
      </div>
      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Qulity Assurance:</b>
          <p className='text-gray-600'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Distinctio cum iure unde perferendis ab veniam!</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Convenient:</b>
          <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis at adipisci deserunt praesentium harum enim.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Exceptional Customer Service:</b>
          <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, animi. Voluptatibus quo aspernatur modi quod.</p>
        </div>
      </div>
      <NewsLetterBox />
    </div>
  )
}

export default About