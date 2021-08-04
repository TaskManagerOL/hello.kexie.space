import React, { useEffect, useRef, useState } from "react"
import Float from "../Float";
import Ball from "../Ball";
import { throttle } from "../../utils";

import ballStyle from '../Ball/index.module.scss';
import useClient from "../../hooks/useClient";
import { AtomUser, BallItem, DirtyMethod, Position } from "./type";


function BallRoom() {
    const [balls, setBalls] = useState<BallItem[]>([]);
    const DirtyMethods = useRef<DirtyMethod>();
    DirtyMethods.current = {
        getBalls: () => balls
    }
    const [client, setDeliverier] = useClient();

    useEffect(() => {
        setDeliverier({ "hello": handleHelloAction });
        setDeliverier({ "enter": handleEnterAction });
        setDeliverier({ "talk": handleTalkAction });
        setDeliverier({ "move": handleMoveAction });
        setDeliverier({ "stand up": handleStandUpAction });
        setDeliverier({ "leave": handleLeaveAction });
    }, []);

    function handleHelloAction() {
        client.send({ type: "rename", userName: client.name, data: { avatar: client.avatar, visitor: client.visitor } });
        client.send({ type: "stand up", userName: client.name });
    }

    function handleEnterAction({ data, userName }: ServerResponse) {
        const nowBalls = DirtyMethods.current?.getBalls()!;

        const atomUser: AtomUser = {
            name: userName,
            position: data.position,
            avatar: data.avatar,
            visitor: data.visitor
        }
        setBalls([...nowBalls, createBall(atomUser)]);
    }

    function handleTalkAction({ data, userName }: ServerResponse) {
        const nowBalls = DirtyMethods.current?.getBalls()!;

        nowBalls.forEach((ball) => {
            if (ball.userName === userName) {
                ball.ballRef!.displayMsg(data);
            }
        });
    }

    function handleMoveAction({ data, userName }: ServerResponse) {
        const nowBalls = DirtyMethods.current?.getBalls()!;

        const { x, y }: Position = data;
        if (userName === client.name) return;
        nowBalls.forEach((ball) => {
            if (ball.userName === userName) {
                ball.floatRef!.moveTo(x, y);
            }
        })
    }

    function handleStandUpAction({ data, userName }: ServerResponse) {
        initializeBalls(
            data.map((x: any) => {
                return ({ ...x, name: x.userName });
            })
        )
    }

    function handleLeaveAction({ data, userName }: ServerResponse) {
        const nowBalls = DirtyMethods.current?.getBalls()!;
        setBalls(nowBalls.filter(self => {
            return self.userName != userName;
        }))
    }

    function initializeBalls(data: Array<AtomUser>) {
        setBalls(data.map(atomUser => createBall(atomUser)));
    }
    function createBall(atomUser: AtomUser): BallItem {
        function floatRef(ref: Float) {
            DirtyMethods.current!.getBalls().forEach(ball => {
                if (ball.userName === atomUser.name) {
                    ball.floatRef = ref;
                }
            })
        }
        function ballRef(ref: BallItem['ballRef']) {
            DirtyMethods.current!.getBalls().forEach(ball => {
                if (ball.userName === atomUser.name) {
                    ball.ballRef = ref;
                }
            })
        }
        const onmoving = throttle((position: Position) => {
            if (client.name === atomUser.name) {
                const res = { type: "move", data: position, userName: atomUser.name };
                client.send(res);
            }
        }, 16);
        const unique = client.name === atomUser.name;
        const halo = { animation: `${unique ? ballStyle.uniqueshine : ballStyle.shine} 2s infinite` };
        const element = (
            <Float
                key={atomUser.name}
                speed={256}
                crossBorder={false}
                initialPosition={atomUser.position}
                zIndex={unique ? 200 : 100}
                onmoving={onmoving}
                ref={floatRef}
            >
                <Ball
                    userName={atomUser.name}
                    avatar={atomUser.avatar}
                    visitor={atomUser.visitor}
                    styles={halo}
                    ref={ballRef}
                    onDoubleClick={unique ? ((e: React.MouseEvent) => client.send({ type: "talk", data: "你好呀！", userName: client.name })) : undefined}
                />
            </Float>
        )
        return { userName: atomUser.name, element };
    }

    return <>{balls ? balls.map(self => self.element) : ''}</>;
}

export default BallRoom;