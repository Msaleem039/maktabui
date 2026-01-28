import React from 'react'

const Buttonstart = ({ onGetStartedClick }) => {
  const handleClick = (e) => {
    e.preventDefault();
    if (onGetStartedClick) {
      onGetStartedClick();
    }
  };

  return (
    <a
      href="#get-started"
      onClick={handleClick}
      className="inline-flex items-center justify-center rounded-full bg-black px-12 py-4 font-semibold text-white transition hover:bg-black/80 cursor-pointer"
      style={{ paddingTop: '1rem', paddingBottom: '1rem', paddingLeft: '3rem', paddingRight: '3rem' }}
    >
      Get Started Now
    </a>
  )
}

export default Buttonstart