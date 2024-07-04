import { Card, CardActions, CardContent, Link, Typography } from '@mui/material';
import * as React from 'react';

const sourceId2Name = ["Wikipedia Infobox", "Wikipedia List", "Wikipedia", "ClueWeb12"]


function getSourceDesc(source: any) {
    if (source.sourceTypeId === 2)
        return <Link href={`https://en.wikipedia.org/?curid=${source.id}`} rel="noreferrer" underline="hover" target="_blank">Wikipedia</Link>
    return <>{sourceId2Name[source.sourceTypeId]} &mdash; {source.id}</>
}

interface SourceBoxProps {
	source: any
};

const SourceBox: React.FC<SourceBoxProps> = (props: SourceBoxProps) => {
    return (
        <Card sx={{mb: 1}} variant="outlined">
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    {props.source.content}
                </Typography>
            </CardContent>
            <CardActions>
                <Typography variant="caption" color="text.secondary">
                    Source: {getSourceDesc(props.source)}
                </Typography>
            </CardActions>
        </Card>
    );
}
export default SourceBox;