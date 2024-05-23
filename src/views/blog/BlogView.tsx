"use client";

import Tab from "@components/components/Tab";
import { useEffect, useState } from "react";
import BlogItem, { BlogItemProps } from "./BlogItem";
import BlogShimmer from "./BlogShimmer";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@components/configs/firebase";
import { useDisclosure } from "@components/hooks/useDisclosure";
import classNames from "classnames";

const tabs = [
  { label: "English", value: "en" },
  { label: "Indonesia", value: "id" },
];

const BlogView = () => {
  const [isLoading, handle] = useDisclosure(true);
  const [tab, setTab] = useState("en");
  const [blogs, setBlogs] = useState<BlogItemProps[]>([]);

  const getBlogs = async () => {
    try {
      handle.open();
      const querySnapshot = await getDocs(collection(db, "blogs"));
      querySnapshot.forEach((doc) => {
        setBlogs((prev) => [...prev, doc.data() as BlogItemProps]);
      });
      handle.close();
    } catch (error) {
      handle.close();
      console.log(error);
      alert("Failed to fetch data");
    }
  };

  useEffect(() => {
    getBlogs();
  }, []);

  if (isLoading) {
    return <BlogShimmer />;
  }
  return (
    <>
      <Tab data={tabs} value={tab} onSelect={setTab} />
      <div className="mt-12 ">
        {blogs
          .filter((blog) => blog.lang === tab)
          .sort((a, b) => b.order - a.order)
          .map((blog) => (
            <div className={classNames("pb-6 border-b mb-6")} key={blog.id}>
              <BlogItem {...blog} />
            </div>
          ))}
      </div>
    </>
  );
};

export default BlogView;
