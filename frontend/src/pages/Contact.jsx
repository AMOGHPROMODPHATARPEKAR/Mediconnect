import React from 'react'

const Contact = () => {
  return (
    <section>
      <div className="px-4 mx-auto max-w-screen-md ">
        <h2 className="heading text-center">Contact US
        </h2>
        <p className="mb-8 lg:mb-16 font-light text-center text_para">Got a technical issue? Want to send feedback about any feature? <b>Let us know</b></p>

        <form action="#" className="space-y-8">
          <div>
            <label htmlFor="email" className="form__label" >Your Email</label>
            <input type="email" id='email' 
            className='mt-1 form__input '
            placeholder='example@123' />
          </div>
          <div >
            <label htmlFor="subject" className="form__label" >Subject</label>
            <input type="text" id='subject' 
            className='mt-1 form__input '
            placeholder='Let us know how we can help you' />
          </div>
          <div className='sm:col-span-2'>
            <label htmlFor="message" className="form__label" >Your Message</label>
            <textarea type="text" id='message' 
            className='mt-1 form__input '
            placeholder='Leave a comment....' />
          </div>


          <div className='flex items-center justify-center h-1'>
          <button type='submit' className=' btn rounded-md sm:w-fit '>Submit</button>
          </div>
          
        </form>
      </div>
    </section>
  )
}

export default Contact