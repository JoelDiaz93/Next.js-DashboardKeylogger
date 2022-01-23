import React, { useEffect, useState } from "react";
import { Grid, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import Report from "../api/report";

const SearchInput = ({ setReports, matchingReports, setIndexToShow }) => {
  const [keystrokes, setKeystrokes] = useState([]);
  const [toSearch, setToSearch] = useState("");
  // const [matchingRecords, setMatchingRecords] = useState([]);

  const {
    control,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm({
    // defaultValues: {
    //   folder_name: "",
    //   description: "",
    // },
    // resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log("DATA DE INPUT", data.search_input);

    if (data.search_input !== undefined) {
      if (data.search_input.length > 3) {
        getKeystrokes();
        setToSearch(data.search_input);
      } else {
        console.log("PALABRA MUY CORT");
      }
    }
  };

  useEffect(() => {
    console.log("KEYSTROKES LIST", keystrokes);
    wordSearch(toSearch);
  }, [keystrokes]);

  // useEffect(() => {
  //   wordSearch(toSearch);
  // }, [toSearch]);

  const getKeystrokes = async () => {
    try {
      const response = await Report.keystrokes();
      setKeystrokes(response.data);
    } catch (e) {
      console.log("Error at get keystrokes", e);
    }
  };

  // useEffect(() => {
  //   console.log("Matching", matchingRecords);
  //   setReports(matchingRecords);
  // }, [matchingRecords]);

  const wordSearch = async (word) => {
    if (!!keystrokes.data) {
      const auxArray = keystrokes.data.filter(
        (keystroke) => keystroke.content.indexOf(word.toLowerCase()) > -1
      );
      const rowIndexes = [];
      for (let i = 0; i < auxArray.length; i++) {
        rowIndexes.push(i);
      }
      setIndexToShow(rowIndexes);
      setReports(auxArray);
      // setMatchingRecords(auxArray);
    }
  };

  return (
    <Grid container direction="row" justifyContent="center" alignItems="center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        // onSubmit={() => console.log("on submit")}
      >
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item>
            <Controller
              name="search_input"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  id="standard-search"
                  label="Ingrese una palabra "
                  type="search"
                  variant="standard"
                />
              )}
            />
            {/*<p>{errors.name?.message}</p>*/}
            {/*{!!errors.folder_name ? <>{errors.folder_name?.message}</> : null}*/}
          </Grid>
          <Grid item marginTop={2} marginLeft={1}>
            {!!matchingReports && matchingReports.length === 0 ? (
              <Button type="submit">Buscar</Button>
            ) : (
              <Button
                onClick={() => {
                  resetField("search_input");
                  setReports([]);
                  setIndexToShow([]);
                  // setMatchingRecords([]);
                }}
              >
                Reset
              </Button>
            )}
          </Grid>
        </Grid>
      </form>
      {/*<Button>Limpiar</Button>*/}
    </Grid>
  );
};

export default SearchInput;
