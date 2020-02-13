/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react";
import { useStaticQuery, graphql, Link } from "gatsby";
import Image from "gatsby-image";

import { rhythm } from "../utils/typography";

const Bio = () => {
	const data = useStaticQuery(graphql`
		query BioQuery {
			avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
				childImageSharp {
					fixed(width: 50, height: 50) {
						...GatsbyImageSharpFixed
					}
				}
			}
			site {
				siteMetadata {
                    title
					author
					social {
						github
					}
				}
			}
		}
	`);

    const { author, title } = data.site.siteMetadata;
	return (
		<div
			style={{
				display: `flex`,
				marginBottom: rhythm(2.5)
			}}
		>
			<Link
				style={{
					boxShadow: `none`,
					textDecoration: `none`
				}}
				to={`/`}
			>
				<Image
					fixed={data.avatar.childImageSharp.fixed}
					alt={author}
					title={title}
					style={{
						marginRight: rhythm(1 / 2),
						marginBottom: 0,
						minWidth: 50,
						borderRadius: `100%`
					}}
					imgStyle={{
						borderRadius: `50%`
					}}
				/>
			</Link>
			<p>
				The wind will not stop
				<br />
				分享编程、阅读，生活感悟和有趣的事～
			</p>
		</div>
	);
};

export default Bio;
