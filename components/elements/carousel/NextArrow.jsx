import React from 'react';

const NextArrow = (props) => {
    const { className, onClick, icon } = props;
    return (
        <div className={`slick-arrow slick-next ${className}`} onClick={onClick}>
            {icon ? (
                <i className={icon}></i>
            ) : (
                <i className="icon-chevron-right"></i>
            )}
        </div>
    );
};

export default NextArrow;
