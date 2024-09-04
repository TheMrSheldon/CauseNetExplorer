import { Card, CardActions, CardContent, Link, Typography } from '@mui/material';
import * as React from 'react';

const sourceId2Name = ["Wikipedia Infobox", "Wikipedia List", "Wikipedia", "ClueWeb12"]


function getSourceDesc(source: any) {
    const sourceName = sourceId2Name[source.sourceTypeId]
    if (source.sourceTypeId === 2)
        return <Link href={`https://en.wikipedia.org/?oldid=${source.id}`} rel="noreferrer" underline="hover" target="_blank">Wikipedia</Link>
    else if (source.sourceTypeId === 3)
        /*return <Link href={`/clueweb12/${source.id}`} rel="noreferrer" underline="hover" target="_blank">{sourceName}</Link>*/
        return <Link href={`https://chatnoir-webcontent.web.webis.de/?index=cw12&trec-id=${source.id}`} rel="noreferrer" underline="hover" target="_blank">{sourceName} on ChatNoir</Link>

    return <>{sourceName} &mdash; {source.id}</>
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