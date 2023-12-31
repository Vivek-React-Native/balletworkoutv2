import React from 'react';
import Svg, { Defs, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

export const BalletShoeIcon = (props: any) => {
    return (
        <Svg opacity={props.opacity} viewBox={props.viewPort ? props.viewPort : "0 0 24 24"} width={props.width} height={props.height}>
            <Path fill="none" d="M0,0H24V24H0Z" />
            <G>
                <G>
                    <Path fill={props.color} class="cls-2" d="M16.5,2.7a1.7,1.7,0,0,1,.7.1c1.3.4,1.9,1.3,2.6,2.7,1.7,3.9,2,7.4.8,10.7A6.78,6.78,0,0,1,18.8,19a2.29,2.29,0,0,1-1.6.7c-.9,0-1.6-.8-1.9-2a13.242,13.242,0,0,1,.4-5.9A6.082,6.082,0,0,0,15,7c-.7-1.2-1-2.4-.6-3.2a1.961,1.961,0,0,1,1.7-1.1h.4m0-1a1.952,1.952,0,0,0-.7.1C13,2.3,12.5,5,14.2,7.6a5.331,5.331,0,0,1,.6,4.1,13.5,13.5,0,0,0-.4,6.3c.4,1.7,1.5,2.7,2.8,2.7a3.365,3.365,0,0,0,2.3-1,7.779,7.779,0,0,0,2.1-3.2c1.3-3.9.7-7.7-.9-11.4a4.812,4.812,0,0,0-3.2-3.3,3.4,3.4,0,0,0-1-.1Z" />
                </G>
                <G>
                    <Path fill={props.color} class="cls-2" d="M7.5,4.4a2.389,2.389,0,0,1,1.4.5c.9.6,1.1,1.9.5,3.2a24.8,24.8,0,0,0-1.1,3.3A11.4,11.4,0,0,0,8.5,14a5.853,5.853,0,0,1,.2,1.3,13.916,13.916,0,0,1-.1,4.6c-.3,1.5-1.2,1.5-1.5,1.5A5.16,5.16,0,0,1,6,21.2a4.186,4.186,0,0,1-2.3-2.4,14.629,14.629,0,0,1-1-3.2,10.05,10.05,0,0,1,0-3c.084-.616.3-.8.3-1.2.2-.8.4-1.7.6-2.4A11.276,11.276,0,0,1,5.5,5.4a2.966,2.966,0,0,1,2-1m0-1A3.355,3.355,0,0,0,4.8,4.7,11.337,11.337,0,0,0,2.7,8.6a16.375,16.375,0,0,0-.9,3.7,12.9,12.9,0,0,0,0,3.4,18.022,18.022,0,0,0,1,3.3,5.482,5.482,0,0,0,2.8,3,4.013,4.013,0,0,0,1.5.3A2.488,2.488,0,0,0,9.6,20a16.043,16.043,0,0,0,.1-4.9,23.316,23.316,0,0,1-.4-3.6,10.208,10.208,0,0,1,1.1-2.9c.8-1.7.6-3.615-.8-4.515A2.957,2.957,0,0,0,7.5,3.4Z" />
                </G>
                <Path strokeMiterLimit={10} stroke={props.color} fill="none" d="M19.4,3.5c-.257.056-1.1-1.1-2.1-.4-.6.4-.9,1.4-.4,3a9.681,9.681,0,0,1,.4,2.8,22.083,22.083,0,0,1-.6,2.9,2.591,2.591,0,0,0,1.516,2.912A2.5,2.5,0,0,0,19,14.8a3.322,3.322,0,0,0,2.84-2.078" />
                <Path strokeMiterLimit={10} stroke={props.color} fill="none" d="M21.1,7.4c-.169.185,1.2,3.7-4.5,5.6" />
                <Path strokeMiterLimit={10} stroke={props.color} fill="none" d="M17.278,8.127S18.8,11.6,21.9,12.3" />
                <Path strokeMiterLimit={10} stroke={props.color} fill="none" d="M5.5,4.6a1.513,1.513,0,0,1,2,1.8A29.135,29.135,0,0,0,7,10.7a21.914,21.914,0,0,0,.5,3.1s.8,2.6-2.2,2.7A2.951,2.951,0,0,1,3.5,16a2.989,2.989,0,0,1-1.3-1.9" />
                <Path strokeMiterLimit={10} stroke={props.color} fill="none" d="M7.2,8.2s0,3.8-5,5.8" />
                <Path strokeMiterLimit={10} stroke={props.color} fill="none" d="M2.9,9.5s.1,3.7,4.6,5.2" />
            </G>
        </Svg>
    );
}

export const RecipeIcon = (props: any) => {
    return (
        <Svg opacity={props.opacity} viewBox={props.viewPort ? props.viewPort : "0 0 24 24"} width={props.width} height={props.height}>
            <G transform="translate(0)">
                <Path fill="none" stroke={props.color} strokeMiterlimit={10} d="M11,9H9V2H7V9H5V2H3V9a4.115,4.115,0,0,0,3.8,4v9H9.3V13a4.043,4.043,0,0,0,3.8-4V2h-2V9Zm5-3v8h2.5v8H21V2C18.2,2,16,4.2,16,6Z" />
                <Path fill="none" strokeMiterlimit={10} d="M0,0H24V24H0Z" />
            </G>
        </Svg>
    );
}

export const ProgressIcon = (props: any) => {
    return (
        <Svg opacity={props.opacity} viewBox={props.viewPort ? props.viewPort : "0 0 24 24"} width={props.width} height={props.height}>
            <G transform="translate(0)">
                <Path fill="none" d="M0,0H24V24H0Z" />
                <G>
                    <Path fill={props.color} d="M21.1,2.1H16.5a.472.472,0,0,0-.5.5v8.7H12.4V7.8a.472.472,0,0,0-.5-.5H7.2a.472.472,0,0,0-.5.5v8H2.5a.472.472,0,0,0-.5.5v4.9a.472.472,0,0,0,.5.5H21.1a.472.472,0,0,0,.5-.5V2.6a.472.472,0,0,0-.5-.5ZM6.7,20.7H3V16.8H6.6v3.9Zm4.6,0H7.7V8.3h3.6V20.7Zm4.7,0H12.4V12.4H16Zm4.6,0H17V3.1h3.6Zm0,0" />
                </G>
            </G>
        </Svg>
    );
}

export const BlogIcon = (props: any) => {
    return (
        <Svg opacity={props.opacity} viewBox={props.viewPort ? props.viewPort : "0 0 24 24"} width={props.width} height={props.height}>
            <G>
                <Path fill="none" class="cls-2" d="M0,0H24V24H0Z" />
                <G>
                    <G>
                        <Path fill={props.color} class="cls-3" d="M14.7,21.1H3.4A1.367,1.367,0,0,1,2,19.7V3.9A1.367,1.367,0,0,1,3.4,2.5H14.8a1.367,1.367,0,0,1,1.4,1.4V19.7A1.52,1.52,0,0,1,14.7,21.1ZM3.4,3.8a.215.215,0,0,0-.2.2V19.8a.215.215,0,0,0,.2.2H14.8a.215.215,0,0,0,.2-.2V3.9a.215.215,0,0,0-.2-.2Z" />
                        <Path fill={props.color} class="cls-3" d="M13.1,7h-8a.576.576,0,0,1-.6-.6.645.645,0,0,1,.6-.6h8.1a.576.576,0,0,1,.6.6C13.8,6.7,13.4,7,13.1,7Z" />
                        <Path fill={props.color} class="cls-3" d="M13.1,10.6h-8a.6.6,0,0,1,0-1.2h8.1a.576.576,0,0,1,.6.6A.73.73,0,0,1,13.1,10.6Z" />
                        <Path fill={props.color} class="cls-3" d="M13.1,14.2h-8a.576.576,0,0,1-.6-.6.645.645,0,0,1,.6-.6h8.1a.576.576,0,0,1,.6.6A.858.858,0,0,1,13.1,14.2Z" />
                        <Path fill={props.color} class="cls-3" d="M13.1,17.9h-8a.576.576,0,0,1-.6-.6.645.645,0,0,1,.6-.6h8.1a.576.576,0,0,1,.6.6A.858.858,0,0,1,13.1,17.9Z" />
                    </G>
                    <Path fill={props.color} class="cls-3" d="M22,6.7h0L20,2.4a.622.622,0,0,0-.6-.4.51.51,0,0,0-.5.4l-2,4.2V19.9a1.216,1.216,0,0,0,1.2,1.2h2.7A1.29,1.29,0,0,0,22,19.9V6.9C22,6.8,22,6.8,22,6.7Zm-1.2.8v8.7H18V7.5ZM19.4,4l1.1,2.3H18.3Zm1.4,15.9H18V17.4h2.8Z" />
                </G>
            </G>
        </Svg>
    );
}

export const SettingsIcon = (props: any) => {
    return (
        <Svg opacity={props.opacity} viewBox={props.viewPort ? props.viewPort : "0 0 24 24"} width={props.width} height={props.height}>
            <G id="Design_here">
                <G>
                    <Path fill={props.color} d="M11.5,7h-8C3.22,7,3,6.78,3,6.5S3.22,6,3.5,6h8C11.78,6,12,6.22,12,6.5S11.78,7,11.5,7z" />
                </G>
                <G>
                    <Path fill={props.color} d="M21.5,7h-6C15.22,7,15,6.78,15,6.5S15.22,6,15.5,6h6C21.78,6,22,6.22,22,6.5S21.78,7,21.5,7z" />
                </G>
                <G>
                    <Path fill={props.color} d="M13.5,9C12.12,9,11,7.88,11,6.5S12.12,4,13.5,4S16,5.12,16,6.5S14.88,9,13.5,9z M13.5,5C12.67,5,12,5.67,12,6.5
			S12.67,8,13.5,8S15,7.33,15,6.5S14.33,5,13.5,5z"/>
                </G>
                <G>
                    <Path fill={props.color} d="M5.5,13h-2C3.22,13,3,12.78,3,12.5S3.22,12,3.5,12h2C5.78,12,6,12.22,6,12.5S5.78,13,5.5,13z" />
                </G>
                <G>
                    <Path fill={props.color} d="M21.5,13h-12C9.22,13,9,12.78,9,12.5S9.22,12,9.5,12h12c0.28,0,0.5,0.22,0.5,0.5S21.78,13,21.5,13z" />
                </G>
                <G>
                    <Path fill={props.color} d="M7.5,15C6.12,15,5,13.88,5,12.5S6.12,10,7.5,10s2.5,1.12,2.5,2.5S8.88,15,7.5,15z M7.5,11C6.67,11,6,11.67,6,12.5
			S6.67,14,7.5,14S9,13.33,9,12.5S8.33,11,7.5,11z"/>
                </G>
                <G>
                    <Path fill={props.color} d="M14.5,19h-11C3.22,19,3,18.78,3,18.5S3.22,18,3.5,18h11c0.28,0,0.5,0.22,0.5,0.5S14.78,19,14.5,19z" />
                </G>
                <G>
                    <Path fill={props.color} d="M21.5,19h-3c-0.28,0-0.5-0.22-0.5-0.5s0.22-0.5,0.5-0.5h3c0.28,0,0.5,0.22,0.5,0.5S21.78,19,21.5,19z" />
                </G>
                <G>
                    <Path fill={props.color} d="M16.5,21c-1.38,0-2.5-1.12-2.5-2.5s1.12-2.5,2.5-2.5s2.5,1.12,2.5,2.5S17.88,21,16.5,21z M16.5,17
			c-0.83,0-1.5,0.67-1.5,1.5s0.67,1.5,1.5,1.5s1.5-0.67,1.5-1.5S17.33,17,16.5,17z"/>
                </G>
            </G>
        </Svg>
    );
}

export const LanguageIcon = (props: any) => {
    return (
        <Svg opacity={props.opacity} viewBox={props.viewPort ? props.viewPort : "0 0 92.07 77.56"} width={props.width} height={props.height}>
            <G id="Icons">
                <G>
                    <Path fill={props.color} d="M87.91,1.4H41.16c-1.38,0-2.5,1.12-2.5,2.5v9.18h5.01V6.4H85.4v33.39h-7.8c-1.32,0-2.41,1.02-2.5,2.33l-0.64,9.15
			L64.64,40.6c-0.47-0.52-1.14-0.81-1.84-0.81h-9.12V18.92c0-1.38-1.12-2.5-2.5-2.5H4.44c-1.38,0-2.5,1.12-2.5,2.5v40.07
			c0,1.38,1.12,2.5,2.5,2.5h8.26l0.88,12.61c0.07,1,0.73,1.86,1.67,2.19c0.27,0.1,0.55,0.14,0.83,0.14c0.69,0,1.36-0.28,1.84-0.81
			l13.02-14.14h20.25c1.38,0,2.5-1.12,2.5-2.5V44.8h8.02l13.02,14.14c0.48,0.52,1.15,0.81,1.84,0.81c0.28,0,0.56-0.05,0.83-0.14
			c0.94-0.33,1.6-1.19,1.67-2.19l0.88-12.61h7.97c1.38,0,2.5-1.12,2.5-2.5V3.9C90.41,2.52,89.29,1.4,87.91,1.4z M48.67,56.49H29.83
			c-0.7,0-1.37,0.29-1.84,0.81l-9.82,10.67l-0.64-9.15c-0.09-1.31-1.18-2.33-2.5-2.33H6.94V21.43h41.73V56.49z"/>
                    <Path fill={props.color} d="M22.56,45.63h11.41l1.84,4.12h4.49l-9.79-21.83h-4.49l-9.79,21.83h4.46L22.56,45.63z M28.26,32.5l4.05,9.29h-8.11
			L28.26,32.5z"/>
                    <Path fill={props.color} d="M58.69,19.76h9.59c-0.23,2.15-0.68,4.53-1.54,6.63c-1.33-2.12-1.85-4.24-1.86-4.28L60,23.24
			c0.06,0.27,0.98,4.14,3.68,7.51c-0.79,0.62-1.7,1.07-2.76,1.31l1.1,4.89c2.24-0.5,4.03-1.52,5.49-2.85
			c1.19,0.69,2.55,1.22,4.12,1.48l0.83-4.94c-0.68-0.11-1.3-0.32-1.87-0.6c1.71-3.26,2.45-7.07,2.75-10.29h3.71v-5.01h-3.53
			c-0.02-1.05-0.08-1.75-0.09-1.89l-4.99,0.44c0,0.03,0.04,0.57,0.06,1.45h-9.81V19.76z"/>
                </G>
            </G>
        </Svg>
    );
};

export default {
    BalletShoeIcon,
    RecipeIcon,
    ProgressIcon,
    SettingsIcon,
    LanguageIcon,
}
