import { PUB_ORIGIN_META_KEYWORDS, PUB_DESCRIPTION } from '~/utilities/constant';

const HeadOriginKeyWordsDes = ({keywords}) => {
    return (
        <>
            <meta name="keywords" content={PUB_ORIGIN_META_KEYWORDS} key="keywords" />
            <meta name="description" content={PUB_DESCRIPTION} key="description" />
            <meta name="og:description" content={PUB_DESCRIPTION} key="og:description" />
        </>
    )
}

export default HeadOriginKeyWordsDes