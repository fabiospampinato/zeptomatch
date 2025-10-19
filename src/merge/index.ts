
/* MAIN */

const merge = ( res: RegExp[] ): RegExp => {

  const source = res.map ( re => re.source ).join ( '|' ) || '$^';
  const flags = res[0]?.flags;

  return new RegExp ( source, flags );

};

/* EXPORT */

export default merge;
