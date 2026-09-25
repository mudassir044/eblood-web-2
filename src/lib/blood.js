export const GROUPS = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']

// Red cell compatibility: donor -> recipients it can safely give to
export const CAN_GIVE_TO = {
  'O-': GROUPS,
  'O+': ['O+', 'A+', 'B+', 'AB+'],
  'A-': ['A-', 'A+', 'AB-', 'AB+'],
  'A+': ['A+', 'AB+'],
  'B-': ['B-', 'B+', 'AB-', 'AB+'],
  'B+': ['B+', 'AB+'],
  'AB-': ['AB-', 'AB+'],
  'AB+': ['AB+'],
}

export const canReceiveFrom = (group) => GROUPS.filter((d) => CAN_GIVE_TO[d].includes(group))
