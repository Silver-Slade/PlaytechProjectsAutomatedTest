import { Page, Locator, expect } from "@playwright/test";

class HomePage {
  loteriasCard: Locator;
  premiosCard: Locator;
  netoLoteriaCard: Locator;
  otrosProductosCard: Locator;
  resultadoFinalCard: Locator;
  balanceOtrosProductosCard: Locator;
  tablaDeResultados: Locator;

constructor(private page: Page) {
    this.page = page;
    this.loteriasCard = page.locator("#divbanca");
    this.premiosCard = page.locator("#divpremios");
    this.netoLoteriaCard = page.locator("#divNeto");
    this.otrosProductosCard = page.locator("#divotrosproductos");
    this.resultadoFinalCard = page.locator("#balance2");
    this.balanceOtrosProductosCard = page.locator("#cupoP");
    this.tablaDeResultados = page.locator("#tb-datagrid-sorteoresultados");

  }  

}

export default HomePage;