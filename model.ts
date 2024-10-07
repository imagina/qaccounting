export function getFieldsProvider(lang: any, valuesToMerge = null) {
  const fields = {
    id: {value: ''},
    banner: {
      type: 'banner',
      vIf: false
    },

    name: {
      value: '',
      type: 'input',
      required: true,
      colClass: 'col-12 col-md-6',
      props: {
        label: `${lang('isite.cms.form.name')}*`
      },
    },
    lastname: {
      value: '',
      type: 'input',
      colClass: 'col-12 col-md-6',
      props: {
        label: lang('isite.cms.form.lastName'),
      },
    },

    personKind: {
      value: 1,
      type: 'select',
      required: true,
      colClass: 'col-12 col-md-6',
      props: {
        label: lang('iaccounting.cms.form.kindPerson') + '*'
      },
      loadOptions: {
        apiRoute: 'apiRoutes.qaccounting.kindPeople',
      }
    },
    typeId: {
      value: 0,
      type: 'select',
      required: true,
      colClass: 'col-12 col-md-6',
      props: {
        label: lang('iaccounting.cms.form.idType') + '*'
      },
      loadOptions: {
        apiRoute: 'apiRoutes.qaccounting.documentTypePeople',
      }
    },

    identification: {
      value: '',
      type: 'input',
      required: true,
      colClass: 'col-10 col-md-5',
      props: {
        label: lang('iaccounting.cms.form.idNumber') + '*'
      }
    },
    checkDigit: {
      value: '',
      type: 'input',
      colClass: 'col-2 col-md-1',
      props: {
        label: lang('iaccounting.cms.form.checkDigit')
      }
    },
    cityId: {
      value: null,
      type: 'select',
      colClass: 'col-12 col-md-6',
      required: true,
      props: {
        label: lang('isite.cms.form.city') + '*'
      },
      loadOptions: {
        filterByQuery: true,
        apiRoute: 'apiRoutes.qlocations.cities',
        select: {label: 'name', id: 'id'}
      }
    },

    phoneNumber: {
      type: 'input',
      colClass: "col-12 col-md-6",
      props: {
        label: lang('isite.cms.label.phoneNumber')
      },
    },
    externalId: {
      value: '',
      type: 'input',
      colClass: 'col-12 col-md-6',
      props: {
        label: lang('isite.cms.form.externalId'),
      }
    },

    address: {
      value: '',
      type: 'input',
      colClass: 'col-12',
      props: {
        label: lang('isite.cms.form.address')
      }
    }
  }

  if (!valuesToMerge) return fields;
  const response: any = {}

  for (const key in valuesToMerge) {
    const field = fields[key];
    const content = valuesToMerge[key]

    response[key] = {
      ...(field || {}),
      ...content
    }

  }

  return response
}
