'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

export default function HomePage() {
  const fetchPosts = async () => {
    const res = await fetch('/api/posts');
    if (!res.ok) throw new Error('Failed to fetch posts');
    return res.json();
  };

  // Updated useQuery to use the object syntax required by TanStack Query v5
  const { data: posts, isLoading, isError } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  if (isLoading) return <div className="text-center">Loading...</div>;
  if (isError) return <div className="text-center text-red-500">Error loading posts.</div>;

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-3xl font-bold text-center mb-6">Blog Posts</h1>
      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts available.</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post._id} className="p-4 border rounded-md shadow-md hover:shadow-lg transition">
              <h2 className="text-xl font-semibold">
                <Link href={`/post/${post._id}`} className="text-blue-500 hover:underline">
                  {post.title}
                </Link>
              </h2>
              <p className="text-gray-600 text-sm">
                By {post.author?.username || 'Unknown'} |{' '}
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
              <p className="mt-2 text-gray-800">{post.content.slice(0, 100)}...</p>
              <Link href={`/post/${post._id}`} className="text-blue-500 mt-2 inline-block hover:underline">
                Read More
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
