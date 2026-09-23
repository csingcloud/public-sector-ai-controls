# Public-Sector AI Controls

**Machine-readable references and reviewable mapping candidates for AI governance.**

Initial research release: **four selected reference catalogs, six candidate
mappings, and three synthetic evidence-planning examples**. The repository is
deliberately explicit about source versions, scope, and unfinished review.

## Contents

| Directory | Contents |
|---|---|
| `frameworks/nist-ai-rmf/` | Selected AI RMF 1.0 governance references |
| `frameworks/nist-800-53/` | Selected Rev. 5 control references |
| `frameworks/irs-1075/` | Selected November 2021 IRS-tailored control references |
| `frameworks/florida-60gg-2/` | Selected rule titles and source pointers |
| `crosswalks/` | Candidate relationships, rationale, limitations, and source locators |
| `examples/` | Agent governance, removable media, and privileged access evidence planning |
| `schema/` | JSON Schemas for the YAML documents |

## Validate

Node.js 22 or later:

```sh
npm ci --ignore-scripts
npm run validate
npm test
```

Validation checks structure, duplicate keys and identifiers, control namespaces,
and reference integrity. It does not determine whether a mapping is correct
or whether a system complies with any requirement.

## How to read a mapping

Each relationship is `related`, with `review_status: candidate`. The source
and target resolve to versioned catalog entries. The rationale explains why
a reviewer might compare the references; the limitation explains what cannot
be inferred. These are author-proposed relationships, not official crosswalks.

AI inventory and security component inventory overlap in practical records,
but their scopes differ. IRS control identifiers preserve IRS tailoring and
federal tax information context. The Florida rows are **theme-level research
candidates only**: they do not claim subsection-level requirement alignment.

The examples are evidence-planning questions with synthetic evidence types.
They report `not-assessed`; they are not automated compliance scores.

## Source register

Primary-source pointers checked on 2026-09-23:

- [NIST AI RMF Core](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/)
- [NIST SP 800-53 Rev. 5](https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final)
- [IRS Publication 1075, November 2021](https://www.irs.gov/pub/irs-pdf/p1075.pdf)
- [Florida Administrative Code, Chapter 60GG-2](https://flrules.org/gateway/ChapterHome.asp?Chapter=60GG-2)
- [NIST SP 800-207](https://csrc.nist.gov/pubs/sp/800/207/final), architectural context

Source texts remain authoritative. Catalog labels and summaries are short
navigation aids, not reproductions of the full requirements. The NIST
publication page identifies later Rev. 5 releases; this selected-reference
dataset is not a complete import or release-level diff of that catalog.

## Next review steps

Confirm applicability and source editions; read the full referenced provisions;
record reviewer and review date; expand mappings to specific clauses; preserve
tailoring and exceptions; then test evidence collection for a defined system.
Candidate mappings must not be silently promoted into compliance claims.

See [NOTICE.md](NOTICE.md) for publication scope and licensing status.

## Related work
- [control-evidence-schema](https://github.com/csingcloud/control-evidence-schema) — A draft JSON Schema for time-bounded control evidence, with synthetic examples and validation.
- [continuous-authorization-lab](https://github.com/csingcloud/continuous-authorization-lab) — A runnable synthetic lab showing how changing evidence affects a privileged-access review.
- [security-control-detections](https://github.com/csingcloud/security-control-detections) — Control-oriented KQL hunting and evidence queries for Microsoft Sentinel and Defender XDR.
- [ai-agent-governance-lab](https://github.com/csingcloud/ai-agent-governance-lab) — A synthetic agent inventory and tool-scope review lab for identity, ownership, authority, and evidence.

More about Cerydora: [cerydora.com](https://cerydora.com).
