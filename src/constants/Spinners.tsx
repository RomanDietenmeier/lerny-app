'use strict';
import React from 'react';
import { SpinnerCircular, SpinnerCircularProps } from 'spinners-react';


export function DefaultSpinner(props: SpinnerCircularProps): JSX.Element {
    return (<SpinnerCircular size={50} thickness={180} speed={33} color="rgba(255,255,255 1)" secondaryColor="rgba(0, 0, 0, 0.44)" {...props} />);
}