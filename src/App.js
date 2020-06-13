import React from "react";
import seedColors from "./seedColors";
import Palette from "./Palette";
import PaletteList from "./PaletteList";
import NewPaletteForm from "./NewPaletteForm";
import SingleColorPalette from "./SingleColorPalette";
import { generatePalette } from "./colorHelpers";
import { Switch, Route } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Page from "./Page";

class App extends React.Component {
  constructor(props) {
    super(props);
    const savedPalettes = JSON.parse(window.localStorage.getItem("palettes"));
    this.state = {
      palettes: savedPalettes || seedColors,
    };
  }

  findPalette = (id) => {
    return this.state.palettes.find((palette) => palette.id === id);
  };

  deletePalette = (id) => {
    this.setState(
      (prevState) => {
        return {
          palettes: prevState.palettes.filter((palette) => palette.id !== id),
        };
      },
      () => {
        this.syncLocalStorage();
      }
    );
  };

  savePalette = (newPalette) => {
    this.setState({ palettes: [...this.state.palettes, newPalette] }, () => {
      this.syncLocalStorage();
    });
  };

  syncLocalStorage = () => {
    window.localStorage.setItem(
      "palettes",
      JSON.stringify(this.state.palettes)
    );
  };

  render() {
    return (
      <Route
        render={({ location }) => (
          <TransitionGroup>
            <CSSTransition classNames="page" timeout={500} key={location.key}>
              <Switch location={location}>
                <Route
                  exact
                  path="/palette/new"
                  render={(routeProps) => (
                    <Page>
                      <NewPaletteForm
                        {...routeProps}
                        palettes={this.state.palettes}
                        savePalette={this.savePalette}
                      />
                    </Page>
                  )}
                />
                <Route
                  path="/"
                  exact
                  render={(routeProps) => (
                    <Page>
                      <PaletteList
                        {...routeProps}
                        deletePalette={this.deletePalette}
                        palettes={this.state.palettes}
                      />
                    </Page>
                  )}
                />
                <Route
                  path="/palette/:id"
                  exact
                  render={(routeProps) => (
                    <Page>
                      <Palette
                        palette={generatePalette(
                          this.findPalette(routeProps.match.params.id)
                        )}
                      />
                    </Page>
                  )}
                />
                <Route
                  path="/palette/:paletteId/:colorId"
                  render={(routeProps) => (
                    <Page>
                      <SingleColorPalette
                        {...routeProps}
                        colorId={routeProps.match.params.colorId}
                        palette={generatePalette(
                          this.findPalette(routeProps.match.params.paletteId)
                        )}
                      />
                    </Page>
                  )}
                />
                <Route
                  render={(routeProps) => (
                    <Page>
                      <PaletteList
                        {...routeProps}
                        deletePalette={this.deletePalette}
                        palettes={this.state.palettes}
                      />
                    </Page>
                  )}
                />
              </Switch>
            </CSSTransition>
          </TransitionGroup>
        )}
      />
    );
  }
}

export default App;

// {
//   /* <div className="App">
//       <Palette palette={generatePalette(seedColors[4])} />
//     </div> */
// }
