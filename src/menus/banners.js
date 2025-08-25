const BANNER_URL = "https://files.catbox.moe/7qcclf.jpg";

const getBanner = () => {
  return {
    photo: BANNER_URL,
    caption: "Welcome to NexoraTech Bot! Use /menu to see all commands.",
  };
};

module.exports = {
  BANNER_URL,
  getBanner,
};