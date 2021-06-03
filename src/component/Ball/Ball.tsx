import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { WechatOutlined, GithubOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router'
import css from './Ball.module.css'
import welcomeCss from '../../pages/Welcome/Welcome.module.css'
import logo from '../../assets/images/logo.png'
import Float from '../Float/Float';
import UserCard from '../UserCard/UserCard';
import config from '../../static/config';

function Ball() {
    const [cardDisplay, setCardDisplay] = useState(false);

    const [cardContent, setCardContent] = useState<JSX.Element>();

    const [user, setUser] = useState<{ name: string, avatar: string, token: string }>();


    useEffect(() => {
        //todo get user by token
        const user = { name: "therainisme", avatar: "https://avatars.githubusercontent.com/u/41776735?v=4&s=60", token: "" }
        // setUser(user)

    }, []);

    function handlerSendMsg(msg: string) {
        setCardDisplay(true)
        setCardContent(
            <div className={css.cardFont}>
                {msg}
            </div>
        )
        setTimeout(() => {
            setCardDisplay(false)
        }, 1000)
    }

    function handlerGithubLogin(e: React.MouseEvent) {
        //todo github oauth
        // window.open(`https://github.yuuza.net/login/oauth/authorize?client_id=${config.GitHub.ClientId}`)
    }

    function handlerDoubleClick(e: React.MouseEvent) {
        if (!user) {
            // User not logged in
            const Login = (
                <>
                    <Button onClick={e => handlerGithubLogin(e)} type="primary" size={'large'} icon={<GithubOutlined />} className={welcomeCss.btn} >
                        我们非常推荐使用Github登陆
                    </Button>
                    <Button type="primary" size={'large'} icon={<WechatOutlined />} className={welcomeCss.btn} >
                        因为我们的微信登陆还没写好!
                    </Button>
                </>
            )
            setCardContent(Login)
        } else {
            const info = (
                <>
                    <span style={{ color: "white" }}>
                        <UserCard login="therainisme" displayAvatar={false} />
                    </span>
                </>
            )
            setCardContent(info)
        }
        setCardDisplay(!cardDisplay)
    }

    return (
        <div>
            <Float speed={256} crossBorder={true}>
                <span onDoubleClick={e => handlerDoubleClick(e)}>
                    <img className={css.logo} src={user === undefined ? logo : user.avatar} alt="" />
                </span>

                <span style={{ display: cardDisplay ? "block" : "none" }}>
                    <div className={css.CardContainer}>
                        <div className={css.triangle}></div>
                        <div className={css.card}>
                            {cardContent}
                        </div>
                    </div>
                </span>
            </Float>
        </div>
    );
}

export default withRouter(Ball);