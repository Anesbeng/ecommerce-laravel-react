import React from "react";

import LastestProducts from "./common/LastestProducts";
import FeaturesProducts from "./common/FeaturedProducts";

import Hero from "./common/Hero";
import Layout from "./common/Layout";

const Home = () => {
  return (
    <>
      <Layout>
        <Hero />

        <LastestProducts />

        <FeaturesProducts />
      </Layout>
    </>
  );
};

export default Home;
