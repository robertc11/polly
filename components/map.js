// FILE NOT IN USE -- MARKED FOR DELETION

import React, { useEffect, useState, useRef } from 'react'
import { createCustomEqual } from "fast-equals"

const Map = ({onClick, onIdle, children, ...options}) => {
    const ref = useRef(null)
    const style = {height: "60vh", width: "70%", margin: "auto"}
    const [map, setMap] = useState()
    
    useEffect(() => {
        if(ref.current && !map){
            setMap(new window.google.maps.Map(ref.current, {}))
        }
        
    }, [ref,map])

    useDeepCompareEffectForMaps(() => {
        if(map){
            map.setOptions(options)
        }
    }, [map,options])

    useEffect(() => {
        if(map){
            ["click","idle"].forEach((eventName) => {
                google.maps.event.clearListeners(map, eventName)
            })

            if(onClick){
                map.addListener("click", onClick)
            }

            if(onIdle){
                map.addListener("idle", () => onIdle(map))
            }

        }
    }, [map,onClick,onIdle])

    // if(map){
    //     map.setCenter(center)
    //     map.setZoom(zoom)
    // }
    
    return(
        <>
            <div ref={ref} style={style} className="border-2 border-violet-400" id="map" />
                {React.Children.map(children, (child) => {
                    if(React.isValidElement(child)){
                        return React.cloneElement(child, {map})
                    }
                })}
        </>
    )
}

function useDeepCompareEffectForMaps(callback, dependencies){
    React.useEffect(callback, dependencies.map(useDeepCompareMemoize))
}

function useDeepCompareMemoize(value){
    const ref = React.useRef()

    if(!deepCompareEqualsForMaps(value, ref.current)){
        ref.current = value
    }

    return ref.current
}

const deepCompareEqualsForMaps = createCustomEqual((deepEqual) => (a,b) => {
    if(a instanceof google.maps.LatLng|| b instanceof google.maps.LatLng){
        return new google.maps.LatLng(a).equals(new google.maps.LatLng(b))
    }

    return deepEqual(a,b)
})

export default Map