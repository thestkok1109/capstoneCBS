import MovieDetailsComponent from "@/components/movieDetails";
import React from "react";
import { useParams } from "react-router-dom";

export default function MovieDetails() {
  const { id } = useParams();

  return (
    <div className="py-20">
      <MovieDetailsComponent id={id} />
    </div>
  );
}
