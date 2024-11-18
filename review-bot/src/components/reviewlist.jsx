import React from "react";
import { useQuery } from "@tanstack/react-query";
import { reviewService } from "../services/reviewService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Star } from "lucide-react";

export const ReviewList = ({ platformId }) => {
  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews", platformId],
    queryFn: () => reviewService.getReviews(platformId),
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Дата</TableHead>
          <TableHead>Рейтинг</TableHead>
          <TableHead>Отзыв</TableHead>
          <TableHead>Статус</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reviews.map((review) => (
          <TableRow key={review.id}>
            <TableCell>{new Date(review.date).toLocaleDateString()}</TableCell>
            <TableCell>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                {review.rating}
              </div>
            </TableCell>
            <TableCell>{review.text}</TableCell>
            <TableCell>
              <div
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                ${
                  review.status === "answered"
                    ? "bg-green-100 text-green-800"
                    : review.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {review.status === "answered"
                  ? "Отвечено"
                  : review.status === "pending"
                  ? "Ожидает"
                  : "Новый"}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
