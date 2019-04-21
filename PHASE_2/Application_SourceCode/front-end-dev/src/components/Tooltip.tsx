import React from 'react';
import { Popover, OverlayTrigger, Button } from 'react-bootstrap';

const popover = (description: string) => (
    <Popover id="popover-basic" style={{maxWidth: '400px'}}>
      {description}
    </Popover>
  );
  
export const Tooltip = (props: {description: string}) => (
    <OverlayTrigger trigger="click" placement="right" overlay={popover(props.description)}>
        <Button variant="outline-secondary">?</Button>
    </OverlayTrigger>
);