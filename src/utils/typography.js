import Typography from "typography";
import Wordpress2016 from "typography-theme-wordpress-2016";

Wordpress2016.overrideThemeStyles = () => {
	return {
		"a.gatsby-resp-image-link": {
			boxShadow: `none`
        },
        "body": {
            margin: 0,
            padding: 0,
            outline: "none",
            "-webkit-touch-callout": "none",
            "-webkit-tap-highlight-color": "rgba(0,0,0,0)",
            "font-family": "PingFang SC,Hiragino Sans GB,Microsoft Yahei,WenQuanYi Micro Hei,sans-serif",
            "-webkit-font-smoothing": "antialiased!important",
        }
	};
};

delete Wordpress2016.googleFonts;

const typography = new Typography(Wordpress2016);

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
	typography.injectStyles();
}

export default typography;
export const rhythm = typography.rhythm;
export const scale = typography.scale;
