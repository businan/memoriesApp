import React, { useState, useEffect } from "react";

import {
  Button,
  Typography,
  Paper,
} from "@material-ui/core";

import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";

import FileBase from "react-file-base64";

import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import { createPost, updatePost } from "../../actions/posts";

import useStyles from "./styles";

const Form = ({ currentId, setCurrentId }) => {
  const post = useSelector((state) =>
    currentId ? state.postReducer.find((p) => p._id === currentId) : null
  );
  const classes = useStyles();
  const dispatch = useDispatch();
  const [postData, setPostData] = useState({
    // creator: "",
    title: "",
    message: "",
    tags: "",
    selectedFile: "",
  });
  const user = JSON.parse(localStorage.getItem('profile'))

  useEffect(() => {
    if (post) {
      setPostData(post);
    }
  }, [post]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (currentId) {
      dispatch(updatePost(currentId, {...postData, name:user?.result?.name}));
    } else {
      dispatch(createPost({...postData, name:user?.result?.name}));
    }
    clear();
  };
  const clear = () => {
    setCurrentId(null);
    setPostData({
      // creator: "",
      title: "",
      message: "",
      tags: "",
      selectedFile: "",
    });
  };

  if (!user?.result?.name){
    return (
      <Paper className={classes.paper}>
        <Typography variant="h6" align="center">
          Please Sign In to create your own memories and like other's memories. 
        </Typography>
      </Paper>
    )
  }


  return (
    <Paper className={classes.paper}>
      <ValidatorForm
        autoComplete="off"
        noValidate
        className={`${classes.root} ${classes.form}`}
        onSubmit={handleSubmit}
      >
        <Typography variant="h6">
          {currentId ? "Updating" : "Creating"} a Memory
        </Typography>
        {/* <div className={classes.fullwidth}>
          <TextValidator
            name="creator"
            variant="outlined"
            label="Creator"
            required
            fullWidth
            validators={["required"]}
            errorMessages={["this field is required"]}
            value={postData.creator}
            onChange={(e) =>
              setPostData({ ...postData, creator: e.target.value })
            }
          />
        </div> */}
        <div className={classes.fullwidth}>
          <TextValidator
            name="title"
            variant="outlined"
            label="Title"
            required
            fullWidth
            validators={["required"]}
            errorMessages={["this field is required"]}
            value={postData.title}
            onChange={(e) =>
              setPostData({ ...postData, title: e.target.value })
            }
          />
        </div>
        <div className={classes.fullwidth}>
          <TextValidator
            name="message"
            variant="outlined"
            label="Message"
            required
            fullWidth
            validators={["required"]}
            errorMessages={["this field is required"]}
            value={postData.message}
            onChange={(e) =>
              setPostData({ ...postData, message: e.target.value })
            }
          />
        </div>
        <div className={classes.fullwidth}>
          <TextValidator
            name="tags"
            variant="outlined"
            label="Tags (coma separated)"
            fullWidth
            required
            validators={["required"]}
            errorMessages={["this field is required"]}
            value={postData.tags}
            onChange={(e) => setPostData({ ...postData, tags: e.target.value })}
          />
        </div>
        <div className={classes.fileInput}>
          <FileBase
            type="file"
            multiple={false}
            onDone={({ base64 }) =>
              setPostData({ ...postData, selectedFile: base64 })
            }
          />
        </div>
        <Button
          className={classes.buttonSubmit}
          variant="contained"
          color="primary"
          size="large"
          type="submit"
          fullWidth
        >
          Submit
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          fullWidth
          onClick={clear}
        >
          Clear
        </Button>
      </ValidatorForm>
    </Paper>
  );
};

export default Form;
