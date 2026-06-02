import pandas as pd
from pathlib import Path

# =====================================================
# LOAD EXCEL ONLY ONCE
# =====================================================

BASE_DIR = Path(__file__).resolve().parent.parent

EXCEL_PATH = BASE_DIR / "data" / "ncm_location.xlsx"

branch_df = pd.read_excel(EXCEL_PATH)

# =====================================================
# NORMALIZE
# =====================================================

branch_df['municipality_match'] = (

    branch_df['Municipality']

    .astype(str)

    .str.strip()

    .str.lower()
)

branch_df['areas_match'] = (

    branch_df['Areas Covered']

    .astype(str)

    .str.strip()

    .str.lower()
)

# =====================================================
# FIND BRANCH
# =====================================================

def find_branch(municipality, address):

    municipality = str(municipality).strip().lower()

    address = str(address).strip().lower()

    # =============================================
    # FILTER MUNICIPALITY
    # =============================================

    filtered = branch_df[

        branch_df['municipality_match']

        == municipality
    ]

    best_match = None

    best_length = 0

    # =============================================
    # SEARCH ADDRESS
    # =============================================

    for _, row in filtered.iterrows():

        area_list = [

            a.strip()

            for a in row['areas_match'].split(',')
        ]

        for area in area_list:

            if area and area in address:

                # LONGEST MATCH WINS

                if len(area) > best_length:

                    best_length = len(area)

                    best_match = row['Branch Name']

    # =============================================
    # RETURN BEST MATCH
    # =============================================

    if best_match:

        return best_match

    # NO AREA MATCH
    return ""