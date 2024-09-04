import { Alert, Box, Skeleton} from "@mui/material";
import { useEffect, useRef, useState } from "react"
import { Link, useParams } from "react-router-dom"
import conf from "../../conf"

export const ArchiveView: React.FC<{}> = () => {
    const [origURL, setOrigURL] = useState<string | null>(null);
    const [timestamp, setTimestamp] = useState<string | null>(null);
    let pageId = useParams().pageid

    useEffect(() => {
        fetch(`${conf.rest_endpoint}/v1/clueweb/${pageId}/info`)
            .then((res) => res.json())
            .then((json) => {
                setOrigURL(json["WARC-Target-URI"])
                setTimestamp(json["WARC-Date"])
            });
    }, [pageId, setOrigURL, setTimestamp]);

    let urlText = (origURL === null)? (<Skeleton variant="text" sx={{display: "inline-block"}}>???</Skeleton>) : (<Link to={origURL}>{origURL}</Link>)
    let dateText = (timestamp === null)? (<Skeleton variant="text" sx={{display: "inline-block"}}>??/??/?? at ??:??</Skeleton>) : (<>{timestamp}</>);

    return (<Box width="100vw" sx={{ display: 'flex', flexFlow: 'column', flexGrow: "1"}}>
        <Alert severity="warning">
            What you are seeing is <b>only</b> a single HTML file from the <Link to="http://lemurproject.org/clueweb12/">ClueWeb12</Link> crawl.<br/>
            Specifically, this is a snapshot of {urlText} taken on {dateText}.
        </Alert>
        <iframe style={{flexGrow: "1"}} title="content" src={`${conf.rest_endpoint}/v1/clueweb/${pageId}/content`}></iframe>
        </Box>)
}