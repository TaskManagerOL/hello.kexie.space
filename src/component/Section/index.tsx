import React, { CSSProperties } from 'react';
import { Typography } from 'antd';
import section from './index.module.scss'

const { Title } = Typography;

export interface IProps {
    title: string;
    description?: string;
    url?:string;
    children: JSX.Element | string;
    bannerStyle?: CSSProperties;
    bannerClassName?: string
}

function Section({ title, description,url, children, bannerStyle, bannerClassName }: IProps) {
    return (
        <section className={section.container}>
            <div className={section.blank} />
            <Title level={1}>{title}</Title>
            <p className={section.description}>{description} <a className={section.url} href="http://game.kexie.space/">{url}</a></p>
            
            <div className={`${section.banner} ${bannerClassName}`} style={bannerStyle}>
                {children}
            </div>
        </section>
    );
}

export default Section;