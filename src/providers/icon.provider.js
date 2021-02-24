import { Home, FeaturedPlayListOutlined } from "@material-ui/icons/";
const iconList = {
	
	board: <FeaturedPlayListOutlined/>,home: <Home/>,
};
const getIcon = (iconName) => {
    // console.log(iconName);
	return iconList[iconName];
};
export default getIcon;
