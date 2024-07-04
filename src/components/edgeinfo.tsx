import { useEffect, useState, } from "react";
import { Box, CircularProgress, Typography, useTheme } from '@mui/material';
import * as React from 'react';
import SourceBox from "./sourcebox";

interface NotSelectedIndicatorProps {
	show: boolean
};

const NotSelectedIndicator: React.FC<NotSelectedIndicatorProps> = (props: NotSelectedIndicatorProps) => {
    const theme = useTheme()
    if (props.show) {
        return (<Typography variant="subtitle1" color={theme.palette.grey[500]}>
            Please click on an edge in CauseNet to show more information here.
        </Typography>);
    }
    return null;
}


interface EdgeInfoProps {
	edge: [string, string] | null
};

const EdgeInfo: React.FC<EdgeInfoProps> = (props: EdgeInfoProps) => {
    const [supports, setSupports] = useState<any | null>(null);
    useEffect(() => {
        if (props.edge != null) {
            fetch(`http://localhost:8080/v1/nodes/${props.edge?.at(0)}/effects/${props.edge?.at(1)}`)
                .then((res) => res.json())
                .then(setSupports);
        }
    }, [props, setSupports]);
    return (
        <Box sx={{p: 2}}>
            <NotSelectedIndicator show={props.edge == null}/>
        {(supports != null)? <><Typography variant="h6">{props.edge?.at(0)} &rarr; {props.edge?.at(1)}</Typography>
        {supports.map((support: any) => (
            <SourceBox source={support} />
        ))}</> : (props.edge && <>No Sources</>)}
        </Box>
    );
}
export default EdgeInfo;