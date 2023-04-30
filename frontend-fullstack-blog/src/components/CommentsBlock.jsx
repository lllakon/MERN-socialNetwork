import React, { useEffect, useState } from "react";
import axios from "../axios";

import { SideBlock } from "./SideBlock";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Skeleton from "@mui/material/Skeleton";
import { AddComment } from "./AddComment";
import { useSelector } from "react-redux";

export const CommentsBlock = ({ postId }) => {
	const userData = useSelector((state) => state.auth.data)
	const [isLoading, setLoading] = useState(true)
	const [comments, setComments] = useState([])
	console.log(comments)

	useEffect(() => {
		axios
			.get(`/comments/${postId}`)
			.then((res) => {
				setComments(res.data)
				setLoading(false)
			})
			.catch((err) => {
				console.log(err)
				alert('Ошибка получения комментариев')
			})
	}, [])

  return (
    <SideBlock title="Комментарии">
      <List>
        {(isLoading ? [...Array(5)] : comments).map((obj, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                {isLoading ? (
                  <Skeleton variant="circular" width={40} height={40} />
                ) : (
                  <Avatar alt={obj.fullName} src={obj.avatarUrl} />
                )}
              </ListItemAvatar>
              {isLoading ? (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Skeleton variant="text" height={25} width={120} />
                  <Skeleton variant="text" height={18} width={230} />
                </div>
              ) : (
                <ListItemText
                  primary={obj.fullName}
                  secondary={obj.text}
                />
              )}
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
			{userData ? (
					<AddComment postId={postId} userData={userData} />
				) : (
					<p style={{textAlign: 'center', padding: '30px 0 45px 0'}}>Войдите или зарегестрируйтесь чтобы оставлять комментарии</p>
				)}
    </SideBlock>
  );
};
