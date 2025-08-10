import { Button } from "@/components/ui/button";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="flex justify-center gap-2 mt-6">
      <Button variant="outline" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>Prev</Button>
      {[...Array(totalPages)].map((_, i) => (
        <Button
          key={i}
          variant={currentPage === i + 1 ? "default" : "outline"}
          onClick={() => onPageChange(i + 1)}
        >
          {i + 1}
        </Button>
      ))}
      <Button variant="outline" disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>Next</Button>
    </div>
  );
}
