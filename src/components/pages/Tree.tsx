import React, { Component } from 'react';
import styles from './Tree.module.css'
import { NavLink } from "react-router-dom";
import Spinner from "../Spinner";
import { getUrlParamValueByKey } from "../../helpers/url";
import { getTree, getFilesByTree, deleteTree } from "../EditTreeForm/actions";
import { formatDate} from '../../helpers/date';
import FileUpload from "../FileUpload";
import { ITreeModelConverted, IJsonTree, IFile } from "../../common/types";
import { ITreeProps, ITreeState } from "./types";
import { getMyTrees } from "../../api/tree";
import Modal from "../Modal/Modal";
import shadows from "@material-ui/core/styles/shadows";

export class Tree extends Component<ITreeProps, ITreeState> {
	static defaultProps = {
		user: null
	}

	private treeId: string | number | null = null;
	private isMyTree: boolean = false;

	constructor(props: ITreeProps) {
		super(props);

		this.state = {
			tree: null,
			loading: true,
			files: [],
			images: [],
			loadingFiles: true,
			modalShow: false,
			modalMessage: "Операция успешно выполнена",
			successfullyDeleted: false,
		}
	}

	convertTree (tree: IJsonTree): ITreeModelConverted {
		const {
			age,
			created,
			conditionAssessment,
			diameterOfCrown,
			heightOfTheFirstBranch,
			numberOfTreeTrunks,
			treeHeight,
			species,
			status,
			treePlantingType,
			trunkGirth,
			updated,
			geographicalPoint,
			id
		} = tree;

		return {
			latitude: {
				title: 'Широта',
				value: geographicalPoint?.latitude ?? null
			},
			longitude: {
				title: 'Долгота',
				value: geographicalPoint?.longitude ?? null
			},
			age: {
				title: 'Возраст (в годах)',
				value: age as number
			},
			created: {
				title: 'Дата и время добавления записи',
				value: created ? formatDate(created) : null
			},
			conditionAssessment: {
				title: 'Визуальная оценка состония',
				value: conditionAssessment
			},
			diameterOfCrown: {
				title: 'Диаметр кроны (в метрах)',
				value: diameterOfCrown ?? null
			},
			heightOfTheFirstBranch: {
				title: 'Высота первой ветви от земли (в метрах)',
				value: heightOfTheFirstBranch ?? null
			},
			numberOfTreeTrunks: {
				title: 'Число стволов',
				value: numberOfTreeTrunks ?? null
			},
			treeHeight: {
				title: 'Высота (в метрах)',
				value: treeHeight ?? null
			},
			species: {
				title: 'Порода',
				value: species?.title ?? null
			},
			status: {
				title: 'Статус дерева',
				value: status ?? null
			},
			treePlantingType: {
				title: 'Тип посадки дерева',
				value: treePlantingType ?? null
			},
			trunkGirth: {
				title: 'Обхват самого толстого ствола (в сантиметрах)',
				value: trunkGirth ?? null
			},
			updated: {
				title: 'Дата и время последнего редактирования',
				value: updated ? formatDate(updated) : null
			},
			id: id ?? 0 // FIXME: is it possible to not know tree id
		}
	}

	componentDidMount() {
		this.treeId = getUrlParamValueByKey('tree');
		this.checkIfMyTree();
		if (this.treeId) {
			getTree(this.treeId)
				.then((tree: IJsonTree) => {
					this.setState({
						tree: this.convertTree(tree),
						loading: false
					}, () => {
						getFilesByTree(tree.fileIds ?? [])
							.then(files => {
								const images = files.filter((file: IFile) => file.mimeType.startsWith('image'));
								const filesWithoutImages = files.filter((file: IFile) => !file.mimeType.startsWith('image'));

								this.setState({
									files: filesWithoutImages,
									images,
									loadingFiles: false
								})
							})
							.catch(error => {
								console.error(error, 'Ошибка при загрузке файлов!');
								this.setState({
									loadingFiles: false
								})
							})
					})
				})
				.catch(error => {
					console.error(error, 'Ошибка!')
					if (this.props.user === null) {
						// TODO: redirect to login
						this.props.history.push('/login');
					}
					this.setState({
						loading: false
					})
				})
		}
	}

	checkIfMyTree() {
		getMyTrees().then(trees => {
			this.isMyTree = false;
			for (let tree of trees) {
				if (tree.id == this.treeId) {
					this.isMyTree = true;
					break;
				}
			}
		})
	}

	deleteCurrentTree = () => {
		if (this.treeId && this.isMyTree) {
			deleteTree(this.treeId).then(succ => {
				if (succ) {
					// alert("tree is deleted");
					this.setState({modalShow: true, modalMessage: "Дерео удалено", successfullyDeleted: true});
					// this.props.history.goBack();
				} else {
					// alert("error while deleting the tree");
					this.setState({modalShow: true, modalMessage: "Ошибка при удалении дерева"});
				}
			});
		}
	}

	handleModalClose = () => {
		this.setState({modalShow: false});
		if (this.state.successfullyDeleted) {
			this.props.history.goBack();
		}
	}

	renderEditLink () {
		const {tree} = this.state;

		return (
			<div className={styles.editLinkWrapper}>
				{ this.isMyTree && <span className={styles.removeLink} onClick={this.deleteCurrentTree}>Удалить</span> }
				<NavLink to={`/trees/tree=${tree?.id}/edit`} className={styles.editLink}>Редактировать</NavLink>
			</div>
		)
	}

	renderRows () {
		const {tree} = this.state;

		const result: JSX.Element[]  = [];

		if (tree == null) {
			return result;
		}
		Object.keys(tree).forEach((key, index) => {
			const treeKey = key as keyof ITreeModelConverted;
			if (treeKey == 'id') {
				return;
			}
			if (tree[treeKey].value) {
				result.push(
					<div key={index} className={styles.row}>
						<div className={styles.col}>
							{tree[treeKey].title}
						</div>
						<div className={styles.col}>
							{tree[treeKey].value}
						</div>
					</div>
				)
			}
		});

		return result;
	}

	renderTable () {
		return (
			<div className={styles.table}>
				<div className={styles.tbody}>
					{this.renderRows()}
				</div>
			</div>
		)
	}

	renderDetails () {
		const {user} = this.props;

		return (
			<div className={styles.wrapper}>
				{user ? this.renderEditLink() : null}
				{this.renderTable()}
			</div>
		)
	}

	renderFiles () {
		const {files, loadingFiles} = this.state;

		if (loadingFiles) {
			return <Spinner />;
		}

		if (files.length) {
			return (
				<>
					<h3 className={styles.title}> Файлы </h3>
					<FileUpload mode="read" files={files} />
				</>
			)
		}

		return null;
	}

	renderImages () {
		const {images, loadingFiles} = this.state;

		if (loadingFiles) {
			return <Spinner />;
		}

		if (images.length) {
			return (
				<>
					<h3 className={styles.title}>Картинки</h3>
					<FileUpload
						mode="read"
						type="image"
						files={images}
					/>
				</>
			)
		}

		return null;
	}

	renderContent () {
		const {loading} = this.state;

		if (loading) {
			return <Spinner />;
		}

		return (
			<React.Fragment>
				<Modal show={this.state.modalShow} onClose={() => this.setState({modalShow: false})}>
					<p>{this.state.modalMessage}</p>
				</Modal>
				<div className={styles.container}>
					<h3 className={styles.title}> Карточка дерева </h3>
					{this.renderDetails()}
					{this.renderImages()}
					{this.renderFiles()}
				</div>
			</React.Fragment>
		)
	}

	render () {
		return this.renderContent();
	}
}

export default Tree;
