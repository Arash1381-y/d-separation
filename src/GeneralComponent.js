import {Button, Container, styled, TextField} from "@mui/material";
import {Card} from "material-ui";

const themeColor = '#6C63FF';
const lightThemeColor = '#5b51ff';
const darkThemeColor = 'rgba(91,81,255,0.44)';

const GraphFormContainer = styled(Container)({
    marginTop: '1rem',
    background: 'white',
    borderRadius: '1rem',
    boxShadow: '0 0 10px 0 rgba(0,0,0,0.2)',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '1rem'
});

const GraphButton = styled(Button)({
    background: themeColor,
    minWidth: '200px',
    marginTop: '10px',
    marginBottom: '10px',
    marginLeft: '10px',
    height: '40px',
    fontSize: '12px',
    fontStyle: 'italic',
    fontWeight: 'bold',
    '&:hover': {
        background: lightThemeColor,
    }
});

const GraphTextField = styled(TextField)({
    marginTop: '10px',
    marginBottom: '10px',
    marginLeft: '10px',
    minHeight: '30px',
    //change color of label text
    '& label.Mui-focused': {
        color: themeColor,
    },

    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: themeColor,
        },
        '&:hover fieldset': {
            borderColor: darkThemeColor,
            borderWidth: '2px'
        },
        '&.Mui-focused fieldset': {
            borderColor: themeColor,
            borderWidth: '2px'
        }
    }
});


const FieldForm = styled('div')({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
});


const WalkContainer = styled(Card)({
    marginTop: '1rem',
    display: 'flex',
});

export {GraphFormContainer, GraphButton, GraphTextField, FieldForm, WalkContainer, themeColor};