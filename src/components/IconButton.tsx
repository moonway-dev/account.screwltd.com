'use client';

import PropTypes from 'prop-types';

const IconButton = ({ icon: Icon, onClick, ariaLabel, className, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`p-2 rounded-full bg-white/10 text-white hover:bg-white/30 ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled}
    >
      {Icon}
    </button>
  );
};


IconButton.propTypes = {
  icon: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  ariaLabel: PropTypes.string,
  className: PropTypes.string,
};

IconButton.defaultProps = {
  onClick: () => { },
  ariaLabel: '',
  className: '',
};

export default IconButton;
