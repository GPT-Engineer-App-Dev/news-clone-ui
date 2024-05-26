import React, { useState, useEffect } from "react";
import { Container, VStack, HStack, Text, Link, Box, Spinner, IconButton } from "@chakra-ui/react";
import { FaArrowUp } from "react-icons/fa";

const Index = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
        const storyIds = await response.json();
        const storyPromises = storyIds.slice(0, 10).map((id) => fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then((res) => res.json()));
        const stories = await Promise.all(storyPromises);
        setStories(stories);
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
      setLoading(false);
    };

    fetchStories();
  }, []);

  return (
    <Container maxW="container.md" py={4}>
      <VStack spacing={4} align="stretch">
        <Text fontSize="3xl" fontWeight="bold" textAlign="center">
          Hacker News
        </Text>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
            <Spinner size="xl" />
          </Box>
        ) : (
          stories.map((story) => (
            <HStack key={story.id} spacing={4} p={4} borderWidth="1px" borderRadius="md">
              <IconButton aria-label="Upvote" icon={<FaArrowUp />} size="sm" />
              <VStack align="start" spacing={1}>
                <Link href={story.url} isExternal fontSize="lg" fontWeight="bold">
                  {story.title}
                </Link>
                <Text fontSize="sm" color="gray.500">
                  by {story.by}
                </Text>
              </VStack>
            </HStack>
          ))
        )}
      </VStack>
    </Container>
  );
};

export default Index;
