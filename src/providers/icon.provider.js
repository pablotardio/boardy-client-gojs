import { Home, FeaturedPlayListOutlined } from "@material-ui/icons/";
const iconList = {
	home: <Home/>,
	board: <FeaturedPlayListOutlined/>,
};
const getIcon = (iconName) => {
    // console.log(iconName);
	return iconList[iconName];
};
export default getIcon;
