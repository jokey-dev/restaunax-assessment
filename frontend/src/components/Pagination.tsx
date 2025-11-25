import { Button, Stack, Typography } from "@mui/material";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onChange,
}: PaginationProps) {
  const handlePrev = () => {
    if (page > 1) onChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) onChange(page + 1);
  };

  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      justifyContent="center"
      mt={2}
    >
      <Button onClick={handlePrev} disabled={page === 1}>
        Prev
      </Button>
      <Typography>
        Page {page} of {totalPages}
      </Typography>
      <Button onClick={handleNext} disabled={page === totalPages}>
        Next
      </Button>
    </Stack>
  );
}
