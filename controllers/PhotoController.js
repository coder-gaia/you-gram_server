const Photo = require("../models/Photo");
const mongoose = require("mongoose");
const User = require("../models/User");

//insert a photo user related
const insertPhoto = async (req, res) => {
  const { title } = req.body;
  const image = req.file.filename;

  const reqUser = req.user;

  const user = await User.findById(reqUser.id);

  //create photo
  const newPhoto = await Photo.create({
    image,
    title,
    userId: user.id,
    userName: user.name,
  });

  //checks if photo was successfully created, return data
  if (!newPhoto) {
    res
      .status(422)
      .json({ errors: ["There was an error. Please try again later."] });
    return;
  }

  res.status(201).json(newPhoto);
};

//remove photo from database
const deletePhoto = async (req, res) => {
  const { id } = req.params;
  const reqUser = req.user;

  try {
    const photo = await Photo.findById(new mongoose.Types.ObjectId(id));

    //checks if photo exists
    if (!photo) {
      res.status(404).json({ errors: ["Could not find photo."] });
      return;
    }

    ///check if photo belongs to user
    if (!photo.userId.equals(reqUser._id)) {
      res
        .status(422)
        .json({ errors: ["There was an error. Please try again later."] });
    }

    await Photo.findByIdAndDelete(photo._id);

    res
      .status(200)
      .json({ id: photo._id, message: "Photo deleted successfully!" });
  } catch (error) {
    res.status(404).json({ errors: ["Could not find photo."] });
  }
};

//get all photos
const getAllPhotos = async (req, res) => {
  const photos = await Photo.find({})
    .populate("userId", "name")
    .sort([["createdAt", -1]])
    .exec();

  return res.status(200).json(photos);
};

//get user photos
const getUserPhotos = async (req, res) => {
  const { id } = req.params;

  const photos = await Photo.find({ userId: id })
    .sort([["createdAt", -1]])
    .exec();

  res.status(200).json(photos);
};

//get photo by id
const getPhotoById = async (req, res) => {
  const { id } = req.params;

  try {
    const photo = await Photo.findById(new mongoose.Types.ObjectId(id));

    //checks is photo exists
    if (!photo) {
      res.status(404).json({ errors: ["Could not find photo."] });
      return;
    }
    res.status(200).json(photo);
  } catch (error) {
    res.status(404).json({ errors: ["Could not find photo."] });
    return;
  }
};

//update a photo
const updatePhoto = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const reqUser = req.user;
  const photo = await Photo.findById({ _id: id });

  //checks is photo exists
  if (!photo) {
    res.status(404).json({ errors: ["Could not find photo."] });
    return;
  }

  ///check if photo belongs to user
  if (!photo.userId.equals(reqUser._id)) {
    res
      .status(422)
      .json({ errors: ["There was an error. Please try again later."] });
    return;
  }

  if (title) {
    photo.title = title;
  }

  await photo.save();

  res.status(200).json({ photo, message: "Photo successfully updated!" });
};

//like a photo
const likePhoto = async (req, res) => {
  const { id } = req.params;
  const reqUser = req.user;

  try {
    const photo = await Photo.findById({ _id: id });

    if (!photo) {
      res.status(404).json({ errors: ["Could not find photo."] });
      return;
    }

    //if the user has liked the photo already, if clicked again removes the like from likes array
    if (photo.likes.includes(reqUser._id)) {
      photo.likes.splice(photo.likes.indexOf(reqUser._id), 1);
      photo.save();

      return res
        .status(200)
        .json({ photoId: id, userId: reqUser._id, message: "Like removed!" });
    }

    //insert user id in likes array
    photo.likes.push(reqUser._id);
    photo.save();

    return res
      .status(200)
      .json({ photoId: id, userId: reqUser._id, message: "Photo liked!" });
  } catch (error) {
    res.status(422).json({ errors: ["You've liked this photo already."] });
    return;
  }
};

//add a comment to the photo
const commentPhoto = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  const reqUser = req.user;

  try {
    const user = await User.findById(reqUser.id);
    const photo = await Photo.findById({ _id: id });

    if (!photo) {
      res.status(404).json({ errors: ["Could not find photo."] });
      return;
    }

    //insert comment to comments array
    const userComment = {
      comment,
      userName: user.name,
      userImage: user.profileImage,
      userId: user._id,
    };

    photo.comments.push(userComment);
    await photo.save();

    return res
      .status(200)
      .json({ comment: userComment, message: "Comment added successfully!" });
  } catch (error) {}
};

//search photo by title
const searchPhotoByTitle = async (req, res) => {
  const { q } = req.query;

  try {
    const photos = await Photo.find({ title: new RegExp(q, "i") }).exec();
    return res.status(200).json(photos);
  } catch (error) {
    res.status(404).json({ errors: ["Could not find photo."] });
    return;
  }
};

module.exports = {
  insertPhoto,
  deletePhoto,
  getAllPhotos,
  getUserPhotos,
  getPhotoById,
  updatePhoto,
  likePhoto,
  commentPhoto,
  searchPhotoByTitle,
};
