import {
  Box,
  Typography,
  Button,
} from "@mui/material";

import { useNavigate } from "react-router-dom";


function CategoryCard({category}) {
    const{children,image,name,id } = category
    const navigate = useNavigate();
    
  return (
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              component="img"
              src={image.url}
              alt={`image of ${name}`}
              sx={{
                width: 100,
                height: 100,
              }}
            ></Box>
            <Typography variant="h5" fontWeight={700} sx={{ color: "primary.main" }}>
                {name}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate("/products", {
                state : {
                    id,
                    children
                }
            })}
            sx={{ textTransform: "none" }}
          >
            View
          </Button>
      </Box>
  );
}

export default CategoryCard;
