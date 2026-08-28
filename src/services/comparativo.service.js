function arredondar(valor) {
  return Math.round(valor * 100) / 100;
}

function somarRegistros(lista) {
  const totalKwh = lista.reduce((acc, c) => acc + c.kwh, 0);
  const totalCusto = lista.reduce((acc, c) => acc + c.custo, 0);
  return {
    totalKwh: arredondar(totalKwh),
    totalCusto: arredondar(totalCusto),
    mediaMensalKwh: lista.length ? arredondar(totalKwh / lista.length) : 0,
    mediaMensalCusto: lista.length ? arredondar(totalCusto / lista.length) : 0,
    registros: lista.length,
  };
}

function variacaoPercentual(valorAntes, valorDepois) {
  if (!valorAntes) return null;
  return arredondar(((valorDepois - valorAntes) / valorAntes) * 100);
}

function calcularComparativoPorSetor(setores, consumosAntes, consumosDepois) {
  return setores.map((setor) => {
    const antes = somarRegistros(consumosAntes.filter((c) => c.setorId === setor.id));
    const depois = somarRegistros(consumosDepois.filter((c) => c.setorId === setor.id));
    return {
      setorId: setor.id,
      setorNome: setor.nome,
      antes,
      depois,
      variacaoPercentualKwh: variacaoPercentual(antes.mediaMensalKwh, depois.mediaMensalKwh),
      variacaoPercentualCusto: variacaoPercentual(antes.mediaMensalCusto, depois.mediaMensalCusto),
    };
  });
}

function calcularComparativo(consumos, setores, dataImplementacaoSolar) {
  const antes = consumos.filter((c) => c.mes < dataImplementacaoSolar);
  const depois = consumos.filter((c) => c.mes >= dataImplementacaoSolar);

  const geralAntes = somarRegistros(antes);
  const geralDepois = somarRegistros(depois);

  return {
    dataImplementacaoSolar,
    geral: {
      antes: geralAntes,
      depois: geralDepois,
      variacaoPercentualKwh: variacaoPercentual(geralAntes.mediaMensalKwh, geralDepois.mediaMensalKwh),
      variacaoPercentualCusto: variacaoPercentual(geralAntes.mediaMensalCusto, geralDepois.mediaMensalCusto),
      economiaEstimadaMensalReais: arredondar(geralAntes.mediaMensalCusto - geralDepois.mediaMensalCusto),
    },
    porSetor: calcularComparativoPorSetor(setores, antes, depois),
  };
}

module.exports = { calcularComparativo };
