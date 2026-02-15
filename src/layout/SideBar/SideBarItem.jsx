import { ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";

const SideBarItem = ({ text, icon, active, path,imageicon }) => {
  const navigate = useNavigate()
  const handleClick = () => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <ListItem
      onClick={handleClick}

      sx={{
        display: "flex",
        alignItems: "start",
        gap:"10px",
        justifyContent: "start",
        borderRadius: "8px",
        mb: 1,
        px: 1,
        py: 1,
        backgroundColor: active ? "#15803d" : "transparent",
        "&:hover": {
          backgroundColor: active ? "#15803d" : "rgba(255, 255, 255, 0.08)",
        },
        cursor: "pointer",
      }}
    >
      {icon &&
      <ListItemIcon
      sx={{
        minWidth: "24px",
        color: active ? "white" : "rgba(255, 255, 255, 0.7)",
        mt: "2px"
      }}
      >
        {icon}
      </ListItemIcon>
    }
    {imageicon &&
      <img src={imageicon} alt="" className="h-6 w-6 object-cover" />
    }
      <ListItemText
  primary={text}
  primaryTypographyProps={{
    fontSize: "14px",
    fontWeight: active ? 500 : 300,
    color: active ? "white" : "rgba(255, 255, 255, 0.7)",
    fontFamily: "'Inter', sans-serif",
  }}
/>

    </ListItem>
  );
};

export default SideBarItem;
