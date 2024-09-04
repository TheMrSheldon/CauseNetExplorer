import { useEffect, useState, } from "react";
import { Box, CircularProgress, Fade, Typography, useTheme } from '@mui/material';
import * as React from 'react';
import SourceBox from "./sourcebox";
import conf from "../conf"

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
        setSupports(null);
        if (props.edge != null) {
            fetch(`${conf.rest_endpoint}/v1/nodes/${props.edge?.at(0)}/effects/${props.edge?.at(1)}`)
                .then((res) => res.json())
                .then(setSupports);
        }
    }, [props, setSupports]);

    const SourceList = React.forwardRef(() => {
        if (props.edge == null)
            return <></>;
        return (<>
            <Typography variant="h6">{props.edge?.at(0)} &rarr; {props.edge?.at(1)}</Typography>
            {(supports == null)? <center><CircularProgress/></center> : (
                (supports.length === 0)? <>No Sources</> : <>{supports.map((support: any) => <Fade in><div><SourceBox source={support} /></div></Fade>)}</>
            )}
        </>);
    });

    return (
        <Box sx={{p: 2, height: 10}}>
            <NotSelectedIndicator show={props.edge == null}/>
            <SourceList />
        </Box>
    );
}
export default EdgeInfo;