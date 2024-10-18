import { useCallback, useEffect, useMemo, useState } from "react"
import * as rdd from 'react-device-detect';
import { useAmp } from "next/amp";
import React from "react";


// export function initViewport() {
//     const width = 750;  // 设计稿宽度
//     const scale = window.innerWidth / width
//     let meta = document.querySelector('meta[name=viewport]')
//     let content = `width=${width}, init-scale=${scale}, user-scalable=no`
//     if(!meta) {
//         meta = document.createElement('meta')
//         meta.setAttribute('name', 'viewport')
//         document.head.appendChild(meta)
//     }
//     meta.setAttribute('content', content)
// }

/**
 * User device mode
 * mode: MOBILE,PAD,DESKTOP
 * @returns 
 */
// 检查，不需要就删除
export default function({children, isMobile}) {
    const isAmp = useAmp()
    const [mode,setMode] = useState(isMobile ? 'MOBILE' : 'DESKTOP')
    
    const deviceInfo = useMemo(() => {
        return {
            isMobile:mode === 'MOBILE',
            isPad:mode === 'PAD',
            isDesktop:mode === 'DESKTOP'
        }
    }, [mode])

    const changeDeviceMode = useCallback(() => {
        if(rdd.isMobile) {
            if(window.screen.width <= 750) {
                setMode('MOBILE')
            }else if(window.screen.width > 750 && w < 1200) {
                setMode('PAD')
            }else {
                setMode('DESKTOP')
            }
            return 
        }

        let currentMode = 'DESKTOP'
        const w = window?.innerWidth // innerWidth outerWidth
        if(w <= 750) {
            currentMode = 'MOBILE'
        }else if(w > 750 && w < 1200) {
            currentMode = 'PAD'
        }else {
            currentMode = 'DESKTOP'
        }
        setMode(currentMode)
    }, [])

    useEffect(() => {
        changeDeviceMode()

        window.addEventListener('resize',changeDeviceMode)

        return () => {
            window.removeEventListener('resize',changeDeviceMode)
        }
    }, [])

    const deviceData = { mode, ...deviceInfo, isAmp }
    return <>
        {/* <Head>
            {
                !deviceInfo.isDesktop ? <meta name="viewport" content="width=750,initial-scale=1" /> : null
            }
        </Head> */}
        {
            typeof children === 'function' ? children(deviceData) : React.cloneElement(children,deviceData)
        }

    </>

    
}