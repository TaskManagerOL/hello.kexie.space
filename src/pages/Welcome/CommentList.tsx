import React from "react";
import { Comment, List, Typography, Popover, ListProps } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import MarkdownParser from "../../utils/markdown";
import { CommentAPI } from "../../api";
import style from "./css/CommentList.module.scss";
import UserCard from "../../component/UserCard";
import { useScrollAnimationRefs } from "../../hooks";

interface IComment {
  author: string;
  avatar: string;
  content: any;
  datetime: JSX.Element | string;
}

function CommentList() {
  const [commentList, setCommentList] = useState<Array<IComment>>();
  const [ScrollAnimationRefs, addScrollAnimationRefs] =
    useScrollAnimationRefs();

  useEffect(() => {
    axios.get(CommentAPI.GithubIssueUrl).then((res) => {
      const commmentList = res.data
        .map((x: any): IComment => {
          const { user, body, updated_at } = x;
          const { login, avatar_url } = user;
          return {
            author: login,
            avatar: `${avatar_url}&s=40`,
            content: MarkdownParser.render(body),
            datetime: moment(updated_at).format(
              "YYYY-MM-DD HH:mm:ss"
            ) as unknown as string,
          };
        })
        .filter((e: IComment) => e.datetime > "2022-01-01 00:00:00");
      console.log(commentList);
      setCommentList(commmentList);
    });
  }, []);

  const [loading, setLoading] = useState(false as ListProps<any>["loading"]);
  useEffect(() => {
    if (!!commentList) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [commentList]);

  return (
    <div className={style.container}>
      <List
        header={<Typography.Title level={3}>畅心所言</Typography.Title>}
        loading={loading}
        itemLayout="horizontal"
        dataSource={commentList}
        renderItem={(item: IComment) => (
          <li ref={addScrollAnimationRefs}>
            <Comment
              className={style.comment}
              author={item.author}
              avatar={
                <Popover
                  content={<UserCard name={item.author} />}
                  placement="topLeft"
                >
                  <img src={item.avatar} alt="" />
                </Popover>
              }
              content={
                <span dangerouslySetInnerHTML={{ __html: item.content }}></span>
              }
              datetime={item.datetime}
            />
          </li>
        )}
      />
    </div>
  );
}

export default CommentList;
