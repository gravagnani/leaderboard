import React from "react";
import tw from "twin.macro";
import { css } from "styled-components/macro"; //eslint-disable-line
import AnimationRevealPage from "helpers/AnimationRevealPage.js";


import Hero from "components/hero/TwoColumnWithFeaturesAndTestimonialLeaderboard.js";
import Blog from "components/blogs/PopularAndRecentBlogPosts.js";
import Footer from "components/footers/FiveColumnWithInputForm.js";

const HighlightedText = tw.span`text-primary-500`

export default () => {
  return (
    <AnimationRevealPage>
      <Hero />
      <Blog
        subheading="Blog"
        heading={<>We love <HighlightedText>Writing</HighlightedText></>}
      />
      <Footer />
    </AnimationRevealPage>
  );
}
