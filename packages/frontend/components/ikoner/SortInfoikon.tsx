import React from 'react';

import { Ikon, IkonProps } from './Ikon';

export const SortInfoikon = ({ width = 24, height = 24, className }: IkonProps) => (
    <Ikon width={width} height={height} viewBox="0 0 24 24" className={className}>
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0ZM12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM9 19V17H11V12H9V10H13V17H15V19H9ZM12 5C12.8284 5 13.5 5.67157 13.5 6.5C13.5 7.32843 12.8284 8 12 8C11.1716 8 10.5 7.32843 10.5 6.5C10.5 5.67157 11.1716 5 12 5Z"
            fill="#262626"
        />
    </Ikon>
);