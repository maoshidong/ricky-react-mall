import { FOLLOW_US } from '~/utilities/constant'
// import { helpersHrefNofollow } from '~/utilities/common-helpers'

const FollowUs = ({ paramMap }) => {

    const getUrl = item => {
        const url = {
            'facebook': paramMap?.facebookUrl,
            'twitter': paramMap?.twitterUrl,
            'youTube': paramMap?.youTubeUrl,
            'tiktok': paramMap?.tiktokUrl,
        }
        window.open(url[item.name] || item?.url, '_blank')
    }
    return (
        <div>
            {
                FOLLOW_US?.map((item, index) => {
                    return (
                        <div
                            className={"pub-color-link mr10 sprite-home-min " + item.class}
                            key={index}
                            onClick={() => getUrl(item)}
                        ></div>
                        // <a
                        //     {...helpersHrefNofollow(item.url)}
                        //     alt={item?.alt} title={item?.alt}
                        //     className={"pub-color-link mr10 sprite-home-min " + item.class}
                        //     key={nanoid()}
                        // ><div className='pub-seo-visibility1'>{item.url}</div></a>
                    )
                })
            } 
        </div>
    )
}

export default FollowUs